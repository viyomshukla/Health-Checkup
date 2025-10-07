const Footer = () => {
  return (
    <footer className="bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Health Checkup. All rights reserved.
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;