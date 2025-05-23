﻿class DomManipulator
{
	CardImage: string;
	CardTitle: string;
	CardSubTitle: string;
	CardContent: string;
	CardSize: number;
	URL: string;

	constructor(nCardImage: string, nCardTitle: string, nCardSubTitle: string, nCardContent: string, nCardSize: number, nURL: string)
	{
		this.CardImage = nCardImage;
		this.CardTitle = nCardTitle;
		this.CardSubTitle = nCardSubTitle;
		this.CardContent = nCardContent;

		if ((nCardSize > 12) || (nCardSize < 1)) { this.CardSize = 2; /* Default = 2 */ }

		else {this.CardSize = nCardSize; }

		this.URL = nURL;

		//Grid Column Medium 2 (Hosting Element)
		let gridColElement = document.createElement('div');
		gridColElement.className = "col-md-" + this.CardSize.toString();
		gridColElement.id = this.CardTitle + "-External-Col";
		gridColElement.style.display = "flex";
		gridColElement.style.justifyContent = "center";
		gridColElement.style.marginBottom = "5%";

		//Card Div
		let cardElement = document.createElement('div');
		cardElement.className = "card";
		cardElement.id = this.CardTitle;
		cardElement.style.width = '75%';
		cardElement.style.background = "white";
		cardElement.style.borderColor = "#dbdbda";

		//Card Image
		let ImgElement = document.createElement('img');
		ImgElement.className = "card-img-top";
		ImgElement.src = this.CardImage;

		//hr
		let hrElement = document.createElement('hr');

		//Card Body
		let cardBodyElement = document.createElement('div');

		cardBodyElement.className = "card-body";
		cardBodyElement.id = this.CardTitle + "-Body";

		//Properties Column
		let ColElement = document.createElement('div');

		ColElement.className = "col text-center justify-content-center";
		ColElement.id = this.CardTitle + "-Inner-Col";

		//Card Title
		let titleElement = document.createElement('h4');
		titleElement.className = "card-title";
		titleElement.style.fontWeight = "bold";
		titleElement.style.fontSize = "18px";
		titleElement.innerHTML = this.CardTitle;

		//Card Sub Title
		let subTitleElement = document.createElement('h5');
		subTitleElement.className = "card-text";
		subTitleElement.style.fontSize = "17.5px";
		subTitleElement.innerHTML = this.CardSubTitle;

		//Card Content
		let contentElement = document.createElement('pre');

		contentElement.className = "card-text";
		contentElement.style.fontSize = "15px";
		contentElement.innerHTML = this.CardContent;
		contentElement.style.overflow = "hidden";
		contentElement.style.whiteSpace = "normal";

		//Card Footer
		let footerElement = document.createElement('div');

		footerElement.className = "card-footer";
		footerElement.id = this.CardTitle + "-Inner-Footer";
		footerElement.innerText = "iTunes";
		footerElement.title = "Visit:" + ' '  + this.URL;
		footerElement.onclick = (()=> window.open(this.URL, "_blank"));
		footerElement.style.background = "#fafaf9";
		footerElement.style.textAlign = "center";

		footerElement.onmouseover = ()=>
		{
			document.getElementById(this.CardTitle + "-Inner-Footer").style.background = "#c0ebe7";
			document.getElementById(this.CardTitle + "-Inner-Footer").style.cursor = "pointer";
			document.getElementById(this.CardTitle).style.borderColor = "#c0ebe7";
			document.getElementById(this.CardTitle).style.background = "#fbfdfd";
		};

		footerElement.onmouseout = ()=>
		{
			document.getElementById(this.CardTitle + "-Inner-Footer").style.background = "#fafaf9";
			document.getElementById(this.CardTitle + "-Inner-Footer").style.cursor = "initial";
			document.getElementById(this.CardTitle).style.borderColor = "#dbdbda";
			document.getElementById(this.CardTitle).style.background = "white";
		};

		//Embed
		document.getElementById("Cards-Row").appendChild(gridColElement); /* Level 1 */
		document.getElementById(this.CardTitle + "-External-Col").appendChild(cardElement); /* Level 2 */
		document.getElementById(this.CardTitle).appendChild(ImgElement); /* Level 3 */
		document.getElementById(this.CardTitle).appendChild(hrElement); /* Level 3 */
		document.getElementById(this.CardTitle).appendChild(cardBodyElement); /* Level 3 */
		document.getElementById(this.CardTitle + "-Body").appendChild(ColElement); /* Level 4 */
		document.getElementById(this.CardTitle + "-Inner-Col").appendChild(titleElement); /* Level 5 */
		document.getElementById(this.CardTitle + "-Inner-Col").appendChild(subTitleElement); /* Level 5 */
		document.getElementById(this.CardTitle + "-Inner-Col").appendChild(contentElement); /* Level 5 */
		document.getElementById(this.CardTitle).appendChild(footerElement); /* Level 3 */
	}
}

class ITunesAPI
{
	static FetchData(Artist: string)
	{
		console.clear();

		//HTML Manipulation
		document.getElementById("Cards-Row").innerHTML = '';

		//Fetch Data
		let ArtistSplit: string[] = Artist.split(' '); /* Split Spaces */
		let APIArtist: string = ArtistSplit[0] + '+';

		for (let I = 1; I < ArtistSplit.length; I++) { APIArtist = APIArtist + ArtistSplit[I] + '+'; }

		APIArtist = APIArtist.substring(0, APIArtist.length - 1); /* Drop Last '+' */

		let URL: string = "https://itunes.apple.com/search?term=" + APIArtist + "&limit=200";

		fetch(URL).then( APIResponse => APIResponse.json()).then( Json =>
		{
			let Results = Json[Object.keys(Json)[0]]; //Results
			console.log("Results:" + ' ' + Results.toString());
			let Array = Json[Object.keys(Json)[1]]; //Information Array
			let DeDupe = []; /* Prevent Duplicate Track Names */

			for (let I = 0; I < Array.length; I++)
			{
				let Trackname = Array[I]["trackName"]; /* Track Name */
				let ArtistName = Array[I]["artistName"]; /* Track Name */

				if (Trackname != undefined)
				{
					Trackname = Trackname.toString().split('(')[0];
					ArtistName = ArtistName.toString().split('(')[0];
					let TrackID = Array[I]["trackId"]; /* Track ID */

					if (DeDupe.indexOf(Trackname.toString()) != -1) { console.log("%cDuplicate Track Name: " + Trackname.toString() + ' ' + '(' + "Track ID: " + ' ' + TrackID + ')', "background: orange; color: white"); }

					else
					{
						DeDupe.push(Trackname.toString());
						let ReleaseDate = Array[I]["releaseDate"]; /* Release Date */
						let ReleaseYear = ReleaseDate.toString().split('-')[0]; /* Release Year */
						let CollectionURL = Array[I]["collectionViewUrl"]; /* Collection URL */
						let ArtistURL = Array[I]["artistViewUrl"]; /* Artist URL */
						let ITunesURL = "NULL"; /* Footer Hyperlink URL */

						if (CollectionURL == undefined) { if (ArtistURL != undefined) { ITunesURL = ArtistURL.toString(); }}

						else { ITunesURL = CollectionURL; };

						let Album = Array[I]["collectionName"]; /* Album Name */

						if (Album == undefined) { Album = "Undefined"; }

						else { Album = Album.toString().split('(')[0]; }

						let domMani = new DomManipulator("iTunes.png", Trackname, ArtistName, "Album: " + Album + '<br>' + "Release Year: " + ReleaseYear, 3,  ITunesURL);
					}
				}
			}
		});
	}
}
