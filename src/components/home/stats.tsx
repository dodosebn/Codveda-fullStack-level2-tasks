const Stats = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 md:pt-16 max-w-2xl mx-auto">
      {[
        { value: "10K+", label: "Active Users" },
        { value: "98%", label: "Satisfaction" },
        { value: "50%", label: "Time Saved" },
        { value: "24/7", label: "AI Support" },
      ].map((stat, index) => (
        <div key={index} className="text-center p-4">
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {stat.value}
          </div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
