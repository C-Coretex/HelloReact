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
		[FunctionName("StartNN")]
		public static async Task<IActionResult> StartNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			try
			{
				var cancellationToken = new CancellationTokenSource();
				
				AsyncNN.asyncNeuralNetwork.Add(AsyncNN.key, new AsyncNN.NN{CancellationToken = cancellationToken, Network = new TeachNetwork()});
				Thread workerThread = new Thread(() => AsyncNN.asyncNeuralNetwork[AsyncNN.key - 1].Network.Start(cancellationToken)); // I don't know why it doesn't work without the '- 1'
				workerThread.Start();
				
				return new OkObjectResult(AsyncNN.key++); //Key so the used could access to the sertain NeuralNetwork
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

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var data = JsonConvert.DeserializeObject<int>(requestBody);

			var NN = AsyncNN.asyncNeuralNetwork[data];

			NN.CancellationToken.Cancel();
			NN.CancellationToken.Dispose();
			
			return new OkObjectResult("success"); //Key so the used could access to the sertain NeuralNetwork
		}

		[FunctionName("TestNN")]
		public static async Task<IActionResult> TestNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var data = JsonConvert.DeserializeObject<int>(requestBody);
			
			try
			{
				var cancellationToken = new CancellationTokenSource();
				var response = await Task.Run(() => AsyncNN.asyncNeuralNetwork[AsyncNN.key - 1].Network.Test(cancellationToken)); // I don't know why it doesn't work without the '- 1'
			
				return new OkObjectResult(response); //Key so the used could access to the sertain NeuralNetwork
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("The error occured at the Task call of the NeuralNetwork " + ex);
			}
		}
		
		[FunctionName("GetNNState")]
		public static async Task<IActionResult> GetNNState([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var data = JsonConvert.DeserializeObject<int>(requestBody);
			
			
			return new OkObjectResult("success   "); //Key so the used could access to the sertain NeuralNetwork
		}
	}
}
