const puppeteer = require('puppeteer');
const fs = require('node:fs');

// Creates a new blank file
fs.writeFile('gba_games.txt', '', err => {
	if (err) {
		console.error(err);
	} else {}
});

(async () => {
	// Launches the browser and opens a new blank page
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Loops through the 5 pages of games
	for (let i = 1; i <= 5; i++) {
		// Connects to the page corresponding to the index of the loop
		await page.goto(`https://www.nintendolife.com/games/browse?system=gba&page=${i}`);
		
		// Allows us to execute javascript inside the browser
		const titles = await page.evaluate(() => {
		
			// Gets all elements that contain game titles
			// Scatter the DOM Nodes into an array
			// Replaces each element in the array by their innerText (title) value
			// Returns an array containing the titles
			let nodeList = document.querySelectorAll('span.title');
			let array = [...nodeList];
			array = array.map( (element) => {
				title = element.innerText
				return title
			});
			return array
		});
		
		// Appends the title to the txt file
		// length - 4 because the last 4 items with this class in the pages are news, not game titles
		for (let i = 0; i < titles.length - 4; i++){
			fs.appendFile('gba_games.txt', `${titles[i]}\n`, err =>{
				if (err) {
					console.error(err);
				} else {}
			});
		}
	}

	// Closes the browser
	await browser.close();
}
)()
