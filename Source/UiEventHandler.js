
class UiEventHandler
{
	static Instance()
	{
		if (this._instance == null)
		{
			this._instance = new UiEventHandler();
		}
		return this._instance;
	}
 
	inputFileToLoad_Changed(inputFileToLoad)
	{
		var fileToLoad = inputFileToLoad.files[0];
		if (fileToLoad != null)
		{
			if (fileToLoad.type.match("image.*") != null)
			{
				var fileReader = new FileReader();
				fileReader.onload =
					this.inputFileToLoad_Changed_FileLoaded.bind(this); 
				fileReader.readAsDataURL(fileToLoad);
			}
		}
	}
 
	inputFileToLoad_Changed_FileLoaded(fileLoadedEvent) 
	{
		var imageLoaded = document.createElement("img");
		imageLoaded.onload =
			this.inputFileToLoad_Changed_FileLoaded_ImgLoaded.bind(this);
		imageLoaded.src = fileLoadedEvent.target.result;
	}

	inputFileToLoad_Changed_FileLoaded_ImgLoaded(imgLoadedEvent)
	{
		var imageToEnlargeAsImgElement =
			imgLoadedEvent.target;

		var d = document;

		var divImageToEnlarge =
			d.getElementById("divImageToEnlarge");
		divImageToEnlarge.innerHTML = "";
		divImageToEnlarge.appendChild(imageToEnlargeAsImgElement);

		var imageToEnlargeAsCanvas =
			d.createElement("canvas");
		imageToEnlargeAsCanvas.width =
			imageToEnlargeAsImgElement.width;
		imageToEnlargeAsCanvas.height =
			imageToEnlargeAsImgElement.height;
		var imageToEnlargeAsGraphicsContext =
			imageToEnlargeAsCanvas.getContext("2d");
		imageToEnlargeAsGraphicsContext
			.drawImage(imageToEnlargeAsImgElement, 0, 0);

		var inputMagnificationFactor =
			d.getElementById("inputMagnificationFactor");
		var magnificationFactor = parseInt(inputMagnificationFactor.value);

		var imageEnlargedAsCanvas =
			d.createElement("canvas");
		imageEnlargedAsCanvas.width =
			imageToEnlargeAsImgElement.width * magnificationFactor;
		imageEnlargedAsCanvas.height =
			imageToEnlargeAsImgElement.height * magnificationFactor;
		var imageEnlargedAsGraphicsContext =
			imageEnlargedAsCanvas.getContext("2d");

		for (var y = 0; y < imageToEnlargeAsImgElement.height; y++)
		{
			for (var x = 0; x < imageToEnlargeAsImgElement.width; x++)
			{
				var pixelAsComponentsRgb =
					imageToEnlargeAsGraphicsContext
						.getImageData(x, y, 1, 1)
						.data
						.slice(0, 3); // Ignore alpha.

				imageEnlargedAsGraphicsContext.fillStyle =
					"rgb("
					+ pixelAsComponentsRgb.join(",")
					")";

				imageEnlargedAsGraphicsContext.fillRect
				(
					x * magnificationFactor, y * magnificationFactor,
					magnificationFactor, magnificationFactor
				);
			}
		}


		var divImageEnlarged =
			d.getElementById("divImageEnlarged");
		divImageEnlarged.innerHTML = "";
		divImageEnlarged.appendChild(imageEnlargedAsCanvas);
 	}

}
