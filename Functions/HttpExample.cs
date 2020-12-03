using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NNFunctions;
using System.Collections.Generic;
using System.Threading;

namespace Functions
{
	public static class AsyncNN
	{
		public struct NN
		{
			public CancellationTokenSource CancellationToken { get; set; }
			public TeachNetwork Network { get; set; }
		}
		public static Dictionary<int, NN> asyncNeuralNetwork = new Dictionary<int, NN>();
		public static int key = 0;
	}

	public static class HttpFunctions
	{

		public struct NNSetup
		{
			public double MomentTemp { get; set; }
			public double LearningRateTemp { get; set; }
			public string NeuronsAndLayers { get; set; }
			public double TerminatingErrorProcents { get; set; }
		}
		[FunctionName("StartNN")]
		public static async Task<IActionResult> StartNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			NNSetup data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<NNSetup>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}
			try
			{
				var cancellationToken = new CancellationTokenSource();

				var network = new TeachNetwork
				{
					MomentTemp = data.MomentTemp == 0 ? 0.5 : data.MomentTemp,
					LearningRateTemp = data.LearningRateTemp == 0 ? 0.1 : data.LearningRateTemp,
					NeuronsAndLayers = string.IsNullOrEmpty(data.NeuronsAndLayers) ? "784 26+ 16 10" : data.NeuronsAndLayers,
					terminatingErrorProcents = data.TerminatingErrorProcents == 0 ? 0.00011 : data.TerminatingErrorProcents
				};

				AsyncNN.asyncNeuralNetwork.Add(AsyncNN.key, new AsyncNN.NN { CancellationToken = cancellationToken, Network = network });
				Thread workerThread = new Thread(() => AsyncNN.asyncNeuralNetwork[AsyncNN.key - 1].Network.Start(cancellationToken)); // I don't know why it doesn't work without the '- 1'
				workerThread.Start();

				return new OkObjectResult(AsyncNN.key++); //A key so the used could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("The error occured at the Task call of the NeuralNetwork " + ex);
			}
		}

		[FunctionName("StopNN")]
		public static async Task<IActionResult> StopNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			int data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<int>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}
			try
			{
				var NN = AsyncNN.asyncNeuralNetwork[data].CancellationToken;

				NN.Cancel();

				return new OkObjectResult(true);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Something bad happened:\n" + ex);
			}
		}

		[FunctionName("ContinueNN")]
		public static async Task<IActionResult> ContinueNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			int data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<int>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}
			try
			{
				var NN = AsyncNN.asyncNeuralNetwork[data];

				var cancellationToken = new CancellationTokenSource();

				AsyncNN.asyncNeuralNetwork[data] = new AsyncNN.NN { CancellationToken = cancellationToken, Network = NN.Network };

				Thread workerThread = new Thread(() => NN.Network.Start(cancellationToken));
				workerThread.Start();

				return new OkObjectResult(true); //Key so the user could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Something bad happened:\n" + ex);
			}
		}

		[FunctionName("TestNN")]
		public static async Task<IActionResult> TestNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			int data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<int>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}
			try
			{
				var cancellationToken = new CancellationTokenSource();
				var response = await Task.Run(() => AsyncNN.asyncNeuralNetwork[AsyncNN.key - 1].Network.Test(cancellationToken)); // I don't know why it doesn't work without the '- 1'

				return new OkObjectResult(response); //Key so the used could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Something bad happened:\n" + ex);
			}
		}

		public struct Response
		{
			public int iteration;
			public int trainingSets;
			public double errorSum;
			public string sw;
		}

		[FunctionName("GetNNState")]
		public static async Task<IActionResult> GetNNState([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			int data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<int>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}

			try
			{
				var NN = AsyncNN.asyncNeuralNetwork[data].Network;

				return new OkObjectResult(new Response { iteration = (int)NN.iteration, trainingSets = NN.trainingSets, errorSum = NN.errorSum, sw = ((double)NN.sw.ElapsedMilliseconds / 1000).ToString("#,0.000", NN.sepByThous) }); //Key so the used could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Something bad happened:\n" + ex);
			}
		}

		[FunctionName("DeleteNN")]
		public static async Task<IActionResult> DeleteNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			int data;
			try
			{
				string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
				data = JsonConvert.DeserializeObject<int>(requestBody);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Nicely done, I've received an error at the JSON deserialization:\n" + ex);
			}

			try
			{
				var NN = AsyncNN.asyncNeuralNetwork[data].CancellationToken;

				NN.Cancel();
				NN.Dispose();
				AsyncNN.asyncNeuralNetwork.Remove(data);

				return new OkObjectResult(true); //Key so the used could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("Something bad happened:\n" + ex);
			}
		}

	}
}
