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

namespace Functions
{
	public class Person
	{
		public string Name { get; set; }
		public int Age { get; set; }
	}

	public static class HttpExample
	{
		[FunctionName("HttpExample")]
		public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");

			string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
			var data = JsonConvert.DeserializeObject<Person>(requestBody);

			string responseMessage = string.IsNullOrEmpty(data.Name)
				? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
				: $"Hello, {data.Name} withe the age {data.Age}. This HTTP triggered function executed successfully.";


			var test = new TeachNetwork();

			test.falseBool = true;
			try
			{
				TeachNetwork.Main().ConfigureAwait(false);
			}
			catch (Exception ex)
			{
				return new BadRequestObjectResult(ex);
			}

			return new OkObjectResult(test);
		}
	}
}
