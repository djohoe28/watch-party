import { Fragment } from "react";
import { RandomRoomButton } from "./RandomRoomButton";
import { Welcome } from "./Welcome";

export function Home() {
	return <Fragment>
		<Welcome />
		<RandomRoomButton />
	</Fragment>
}