using System.Diagnostics;

namespace ExamServer.Utils
{
    public class Statistics
    {
        public static Dictionary<double, int> GetDistribution(List<int> grades)
        {
            int falseGradeIndex = grades.IndexOf(-1);
            if (falseGradeIndex != -1)
            {
                grades.RemoveAt(falseGradeIndex);
            }

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
            int falseGradeIndex = grades.IndexOf(-1);
            if (falseGradeIndex != -1)
            {
                grades.RemoveAt(falseGradeIndex);
            }
            var mode = grades.GroupBy(g => g)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();
            return mode;
        }

        public static double GetMedian(List<int> grades)
        {
            List<int> sortedGrades = grades.OrderBy(g => g).ToList();
            if (sortedGrades[0] == -1)
            {
                sortedGrades.RemoveAt(0);
            }
            var count = sortedGrades.Count;
            if (count % 2 == 0)
                return (sortedGrades[count / 2 - 1] + sortedGrades[count / 2]) / 2;
            return sortedGrades[count / 2];
        }

        public static double GetAverage(List<int> grades)
        {
            int falseGrade = 0;
            int sum = 0;
            for (int i = 0; i < grades.Count; i++)
            {
                if (grades[i] != -1)
                {
                    sum += grades[i];   
                }
            }
            return sum / (grades.Count - falseGrade);
        }
        public static List<int> GetDifference(List<int> grades)
        {
            int falseGradeIndex = grades.IndexOf(-1);
            if (falseGradeIndex != -1)
            {
                grades.RemoveAt(falseGradeIndex);
            }
            var differences = new List<int>();
            //differences.Add(grades[0]);
            for (int i = 0; i < grades.Count - 1; i++)
            {
                differences.Add(Math.Abs(grades[i + 1] - grades[i]));
            }
            return differences;
        }
    }
}
