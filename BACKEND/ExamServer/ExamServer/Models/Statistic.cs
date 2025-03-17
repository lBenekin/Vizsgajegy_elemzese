namespace ExamServer.Models
{
    public class Statistic
    {
        public double Average { get; set; }
        public double Median { get; set; }
        public double Mode { get; set; }
        public Dictionary<double, int> Distribution { get; set; }
    }
}
