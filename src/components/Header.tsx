
import React from 'react';
import { FileCheck, Home, Settings, Book, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="h-6 w-6 text-financial-primary" />
            <h1 className="text-xl font-bold text-financial-primary">TermSure AI</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-sm">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Book className="h-4 w-4 mr-1" />
              Documents
            </Button>
            <Button variant="default" size="sm" className="text-sm bg-financial-primary">
              <FileCheck className="h-4 w-4 mr-1" />
              Validation
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <HelpCircle className="h-4 w-4 mr-1" />
              Help
            </Button>
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* <span className="text-xs px-2 py-1 bg-financial-primary/10 text-financial-primary rounded-full font-medium">
              Beta
            </span>
            <Button variant="outline" size="sm" className="hidden md:flex text-sm">
              Documentation
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
