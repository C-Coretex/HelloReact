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

namespace Functions
{
	public static class AsyncNN
	{
		public static Dictionary<int, Task> asyncNeuralNetwork = new Dictionary<int, Task>();
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
				var curNN = new TeachNetwork();

				var task = curNN.Start();
				task.ConfigureAwait(false).GetAwaiter();

				AsyncNN.asyncNeuralNetwork.Add(AsyncNN.asyncNeuralNetwork.Count, task);
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

			var neuralNetwork = AsyncNN.asyncNeuralNetwork[data];

			return new OkObjectResult("success"); //Key so the used could access to the sertain NeuralNetwork
		}
	}
}
