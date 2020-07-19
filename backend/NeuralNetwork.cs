using System;
using NN;
using MNISTReader;
using System.IO;

namespace NeuralNetwork
{
	class TeachNetwork
	{
		readonly static string path = Path.Combine(AppContext.BaseDirectory, @"..\..\..\data\");
			
		readonly static byte[] labelData = File.ReadAllBytes(path + "train-labels.idx1-ubyte");
		readonly static byte[] imageData = File.ReadAllBytes(path + "train-images.idx3-ubyte");
		
		static void Main()
		{
			var train = Reader.LoadDigitImages(labelData, imageData);
			
			foreach(var item in train[0].Data)
				Console.Write(item + " ");
			
			Console.WriteLine();	
			Console.WriteLine("--------------------------------------------------------------------------------------------------------------------------------");
			Console.WriteLine();
			Console.WriteLine();
			
			foreach(var item in train[0].Label)
				Console.Write(item + " ");

			Console.WriteLine();
		}
	}
}