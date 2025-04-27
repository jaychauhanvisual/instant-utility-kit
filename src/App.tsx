import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

// PDF Tool Routes
import PDFTools from "./pages/pdf";
import MergePDF from "./pages/pdf/MergePDF";

// Image Tool Routes
import ImageTools from "./pages/image";

// Calculator Tool Routes
import CalculatorTools from "./pages/calculator";

// Text Tool Routes
import TextTools from "./pages/text";

// Other Tool Routes
import OtherTools from "./pages/other";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* PDF Tools */}
          <Route path="/pdf" element={<PDFTools />} />
          <Route path="/pdf/merge" element={<MergePDF />} />
          
          {/* Image Tools */}
          <Route path="/image" element={<ImageTools />} />
          
          {/* Calculator Tools */}
          <Route path="/calculator" element={<CalculatorTools />} />
          
          {/* Text Tools */}
          <Route path="/text" element={<TextTools />} />
          
          {/* Other Tools */}
          <Route path="/other" element={<OtherTools />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
