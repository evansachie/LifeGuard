namespace LifeGuard.Services
{
    public interface IReturnUrlValidator
    {
        bool ValidUrl(string url);
        string DefaultUrl { get; }
    }

    public class ReturnUrlValidator : IReturnUrlValidator
    {
        public string DefaultUrl { get; }
        
        public ReturnUrlValidator()
        {
            DefaultUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? throw new InvalidOperationException("FRONTEND_URL variable not set") ;

        }
        private static readonly string[] _allowedHosts = new[]
        {
            "https://lifeguard-vq69.onrender.com",
            "https://lifeguard-vert.vercel.app"
        };

        public bool ValidUrl(string url)
        {
            if (!Uri.TryCreate(url,UriKind.Absolute,out var uri))
                return false;
            return _allowedHosts.Contains(uri.Host);
        }



    }
}
