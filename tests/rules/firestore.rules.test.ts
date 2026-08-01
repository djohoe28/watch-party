import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import path from "path";
import { afterAll, afterEach, beforeAll, describe, it } from "vitest";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
	testEnv = await initializeTestEnvironment({
		projectId: "demo-covid-player-rules-test",
		firestore: {
			rules: readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8"),
			host: "localhost",
			port: 8080,
		},
	});
});

afterAll(async () => {
	await testEnv.cleanup();
});

afterEach(async () => {
	await testEnv.clearFirestore();
});

async function seedRoomWithMember(roomId: string, memberId: string) {
	await testEnv.withSecurityRulesDisabled(async (context) => {
		const db = context.firestore();
		await setDoc(doc(db, "rooms", roomId), { createdAt: new Date() });
		await setDoc(doc(db, "rooms", roomId, "members", memberId), { id: memberId });
	});
}

describe("firestore.rules", () => {
	describe("rooms", () => {
		it("denies read access to unauthenticated users", async () => {
			await seedRoomWithMember("room1", "alice");
			const unauthed = testEnv.unauthenticatedContext();
			await assertFails(getDoc(doc(unauthed.firestore(), "rooms/room1")));
		});

		it("allows an authenticated user to read a room, even if not a member", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertSucceeds(getDoc(doc(bob.firestore(), "rooms/room1")));
		});

		it("allows any authenticated user to create a new room", async () => {
			const alice = testEnv.authenticatedContext("alice");
			await assertSucceeds(setDoc(doc(alice.firestore(), "rooms/new-room"), { createdAt: new Date() }));
		});

		it("denies a non-member from updating an existing room", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertFails(setDoc(doc(bob.firestore(), "rooms/room1"), { title: "hijacked" }, { merge: true }));
		});

		it("allows a member to update their room", async () => {
			await seedRoomWithMember("room1", "alice");
			const alice = testEnv.authenticatedContext("alice");
			await assertSucceeds(setDoc(doc(alice.firestore(), "rooms/room1"), { title: "movie night" }, { merge: true }));
		});
	});

	describe("members", () => {
		it("allows a user to create their own member document", async () => {
			await testEnv.withSecurityRulesDisabled(async (context) => {
				await setDoc(doc(context.firestore(), "rooms/room1"), { createdAt: new Date() });
			});
			const alice = testEnv.authenticatedContext("alice");
			await assertSucceeds(setDoc(doc(alice.firestore(), "rooms/room1/members/alice"), { id: "alice" }));
		});

		it("denies a user from writing another member's document", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertFails(
				setDoc(doc(bob.firestore(), "rooms/room1/members/alice"), { name: "hijacked" }, { merge: true })
			);
		});

		it("allows any authenticated user to list members", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertSucceeds(getDocs(collection(bob.firestore(), "rooms/room1/members")));
		});

		it("denies unauthenticated users from reading members", async () => {
			await seedRoomWithMember("room1", "alice");
			const unauthed = testEnv.unauthenticatedContext();
			await assertFails(getDocs(collection(unauthed.firestore(), "rooms/room1/members")));
		});
	});

	describe("messages", () => {
		it("denies a non-member from listing messages (matches the MessageList.tsx FIXME)", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertFails(getDocs(collection(bob.firestore(), "rooms/room1/messages")));
		});

		it("allows a member to list messages", async () => {
			await seedRoomWithMember("room1", "alice");
			const alice = testEnv.authenticatedContext("alice");
			await assertSucceeds(getDocs(collection(alice.firestore(), "rooms/room1/messages")));
		});

		it("allows a member to send a message with their own senderId", async () => {
			await seedRoomWithMember("room1", "alice");
			const alice = testEnv.authenticatedContext("alice");
			await assertSucceeds(
				addDoc(collection(alice.firestore(), "rooms/room1/messages"), {
					senderId: "alice",
					text: "hello",
					sentAt: new Date(),
				})
			);
		});

		it("denies a member from sending a message with a forged senderId", async () => {
			await seedRoomWithMember("room1", "alice");
			const alice = testEnv.authenticatedContext("alice");
			await assertFails(
				addDoc(collection(alice.firestore(), "rooms/room1/messages"), {
					senderId: "bob",
					text: "spoofed",
					sentAt: new Date(),
				})
			);
		});

		it("denies a non-member from sending a message, even with their own senderId", async () => {
			await seedRoomWithMember("room1", "alice");
			const bob = testEnv.authenticatedContext("bob");
			await assertFails(
				addDoc(collection(bob.firestore(), "rooms/room1/messages"), {
					senderId: "bob",
					text: "hi",
					sentAt: new Date(),
				})
			);
		});
	});

	describe("default deny", () => {
		it("denies access to collections outside of the modeled schema", async () => {
			const alice = testEnv.authenticatedContext("alice");
			await assertFails(getDoc(doc(alice.firestore(), "secrets/topSecret")));
		});
	});
});
