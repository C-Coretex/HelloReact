using System;
using NN;

namespace Back_end
{
    class Program
    {
        static void Main(string[] args)
        {
            var data = FileReaderMNIST.LoadImagesAndLables(
                "./data/train-labels-idx1-ubyte.gz",
                "./data/train-images-idx3-ubyte.gz");
            
            Console.WriteLine("Hello World!");
        }
    }
}
