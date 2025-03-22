import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

interface DownloadReportProps {
  userId: number;
}

const DownloadReport = ({ userId }: DownloadReportProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      // Direct browser to download the PDF
      window.open(`/api/assessments/${userId}/download`, '_blank');
      
      toast({
        title: "Report download started",
        description: "Your assessment report is being generated and downloaded.",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      className="flex items-center gap-2"
    >
      <FileText size={16} />
      Download PDF Report
    </Button>
  );
};

export default DownloadReport;
