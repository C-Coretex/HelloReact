using System;
using NN;
using MNISTReader;
using System.IO;
using System.Globalization;
using System.Threading.Tasks;
using System.Threading;

namespace NNFunctions
{
	public class TeachNetwork
	{
        private CancellationToken ct;
		readonly static string path = @"C:\Users\valer\Desktop\GitSave\HelloReact\backend\data\";

		public double MomentTemp = 0.5;
		public double LearningRateTemp = 0.1;
		public string NeuronsAndLayers = "784 26+ 16 10"; //"[0]-InputNeurons, [1]-Neurons In 1-st HiddenLayer,
													  //  [2]-Neurons In 2-nd HiddenLayer,[..],[n-1]-Neurons In (n-1)-th HiddenLayer, [n]-OutputNeurons"
													  //   put + in each layer (except OUTPUT) to add bias
		public double terminatingErrorProcents = 0.00011; //The average error procent on which we want to end training
		//public static readonly uint refreshSpeed = 1800;

		private uint CheckForMistakes(ref NeuralNetwork network, ref LabeledTrainingData[] testData)
		{	
			uint errCount = 0;

			for (uint i = 0; i < testData.GetLength(0); ++i) //Run through all TEST units
			{
				Neuron[] answer = network.RunNetwork(testData[i].Data);

				double biggestNumber = answer[0].value;
				uint bigNumIndex = 0;
				for (uint j = 0; j < answer.Length; ++j) //Normalizing answers in this unit
				{
					if (answer[j].value > biggestNumber)
					{
						biggestNumber = answer[j].value;
						bigNumIndex = j;
					}

					answer[j].value = 0;
				}
				answer[bigNumIndex].value = 1;

				for (uint j = 0; j < answer.Length; ++j) //Checking answers in this unit for a mistake
				{
					if (answer[j].value != testData[i].Label[j]) //If a mistake was made then:
					{
						++errCount;
						break;
					}
				}
			}

			return errCount;
		}
		
		public uint iteration;
		private LabeledTrainingData[] test;
		private NeuralNetwork network;

		public async Task Start(CancellationTokenSource tokenSource2)
		{
			ct = tokenSource2.Token;
			
			Console.WriteLine("NeuralNetwork created");
			
			await Task.Run(() => 
			{
				ct.ThrowIfCancellationRequested();

				var sepByThous = (NumberFormatInfo)CultureInfo.InvariantCulture.NumberFormat.Clone();
				sepByThous.NumberGroupSeparator = " ";

				#region Training&Test initialization

				byte[] labelData = File.ReadAllBytes(path + "train-labels.idx1-ubyte");
				byte[] imageData = File.ReadAllBytes(path + "train-images.idx3-ubyte");

				var train = Reader.LoadDigitImages(labelData, imageData);

				labelData = File.ReadAllBytes(path + "t10k-labels.idx1-ubyte");
				imageData = File.ReadAllBytes(path + "t10k-images.idx3-ubyte");
				test = Reader.LoadDigitImages(labelData, imageData);

				#endregion

				#region Main part - network training
				//Creating an object of NeuralNetwork with same parameters as we described in variables
				//NeuralNetwork network = new NeuralNetwork(@"C:\s\Neural.aaa");
				network = new NeuralNetwork(NeuronsAndLayers, -1, 1)
				{
					Moment = MomentTemp,
					LearningRate = LearningRateTemp
				};

				System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();
				sw.Start();

				double errorSum;
				uint i;
				uint j;
				double end;
				double error;
				int trainingSets = 1;
				Neuron[] endValue;
				do
				{
					iteration = 0;
					errorSum = 0;
					for (i = 0; i < train.Length; ++i) //Run through all TRAIN units
					{
						//Running the network with current INPUT values of this unit
						endValue = network.RunNetwork(train[i].Data);

						//Counting an error of current unit
						end = 0;
						for (j = 0; j < endValue.Length; ++j)
							end += Math.Pow(train[i].Label[j] - endValue[j].value, 2);
						error = end / train.Length; //((i-a1)*(i1-a1)+...+(in-an)*(in-an))/n
						errorSum += error;

						network.TeachNetwork(train[i].Label);

						if (iteration++ % 1800 == 0)
							//Console.WriteLine("Iteration: " + trainingSets + " | " + iteration.ToString("#,0", sepByThous) + "  current error = " + error + "% " + "  average error = " + Math.Round(errorSum / train.GetLength(0) * 100, 5) + "% " + ((double)sw.ElapsedMilliseconds / 1000).ToString("#,0.000", sepByThous) + " sec");
					
						if(ct.IsCancellationRequested)
						{
							Console.WriteLine("\nI'm disposing :'(\n");

							ct.ThrowIfCancellationRequested();
						}
					}
					++trainingSets;
				} while (errorSum / train.GetLength(0) * 100 > terminatingErrorProcents); //while average error procent is greater tnah TEP - continue
				sw.Stop();
				#endregion
			}, tokenSource2.Token);
		}
		
		public async Task<int> Test(CancellationTokenSource tokenSource2)
		{
			var errCount = await Task.Run(() => CheckForMistakes(ref network, ref test), tokenSource2.Token);
			
			return (int)errCount;
		}
	}
}