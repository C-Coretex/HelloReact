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
	}

	public static class HttpFunctions
	{
		[FunctionName("StartNN")]
		public static async Task<IActionResult> StartNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			//string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			//var data = JsonConvert.DeserializeObject<Person>(requestBody);

			try
			{
			//	var curNN = new TeachNetwork();

				var cancellationToken = new CancellationTokenSource();

			//	Thread workerThread = new Thread(() => curNN.Start(cancellationToken));
				//workerThread.Start();

				//AsyncNN.asyncNeuralNetwork.Add(AsyncNN.asyncNeuralNetwork.Count, new AsyncNN.NN{CancellationToken = cancellationToken, Network = workerThread});
			
				AsyncNN.asyncNeuralNetwork.Add(AsyncNN.asyncNeuralNetwork.Count, new AsyncNN.NN{CancellationToken = cancellationToken, Network = new TeachNetwork()});
				Thread workerThread = new Thread(() => AsyncNN.asyncNeuralNetwork[AsyncNN.asyncNeuralNetwork.Count - 1].Network.Start(cancellationToken));
				workerThread.Start();
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult("The error occured at the Task call of the NeuralNetwork " + ex);
			}

			return new OkObjectResult(AsyncNN.asyncNeuralNetwork.Count - 1); //Key so the used could access to the sertain NeuralNetwork
		}


		[FunctionName("StopNN")]
		public static async Task<IActionResult> StopNN([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var data = JsonConvert.DeserializeObject<int>(requestBody);

			var NN = AsyncNN.asyncNeuralNetwork[data];

			uint test = NN.Network.iteration;

			NN.CancellationToken.Cancel();
			NN.CancellationToken.Dispose();
			
			
			return new OkObjectResult("success   " + test); //Key so the used could access to the sertain NeuralNetwork
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
