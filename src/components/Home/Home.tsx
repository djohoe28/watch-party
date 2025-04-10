import { Fragment } from "react";
import { RandomRoomButton } from "@components/Home/RandomRoomButton";
import { Welcome } from "@components/Home/Welcome";

export function Home() {
	return <Fragment>
		<Welcome />
		<RandomRoomButton />
	</Fragment>
}