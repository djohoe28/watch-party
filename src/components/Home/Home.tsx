import { RandomRoomButton } from "@components/Home/RandomRoomButton";
import { Welcome } from "@components/Home/Welcome";
import { Fragment } from "react";

export function Home() {
	return <Fragment>
		<Welcome />
		<RandomRoomButton />
	</Fragment>
}