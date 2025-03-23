namespace ExamServer.Utils
{
    public class Statistics
    {
        public static Dictionary<double, int> GetDistribution(List<int> grades)
        {

            var gradeRange = new Dictionary<double, int>
            {
                { 1, 0 },
                { 2, 0 },
                { 3, 0 },
                { 4, 0 },
                { 5, 0 }
            };

            foreach (var grade in grades)
            {
                if (gradeRange.ContainsKey(grade))
                {
                    gradeRange[grade]++;
                }
            }

            return gradeRange;
        }
        public static double GetMode(List<int> grades)
        {
            var mode = grades.GroupBy(g => g)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();
            return mode;
        }

        public static double GetMedian(List<int> grades)
        {
            grades.Sort();
            var count = grades.Count;
            if (count % 2 == 0)
                return (grades[count / 2 - 1] + grades[count / 2]) / 2;
            return grades[count / 2];
        }

        public static double GetAverage(List<int> grades)
        {
            return grades.Average();
        }
    }
}
