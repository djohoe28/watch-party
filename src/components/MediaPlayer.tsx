export const MediaPlayer = () => {
	return (
		<>
			<video id="video" controls>
				<source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</>
	);
}