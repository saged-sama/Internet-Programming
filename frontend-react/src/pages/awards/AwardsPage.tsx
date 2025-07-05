import { useState, useEffect } from "react";
import { AwardsGrants } from "../../components/awards/AwardsGrants";
import type {
  Award,
} from "../../types/financials";
import financialsData from "../../assets/financials.json";

export function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);

  useEffect(() => {
    // Load mock data with proper type casting
    setAwards(financialsData.awards as Award[]);
  }, []);

  const handleAwardApproval = async (awardId: string, approved: boolean) => {
    // Update award status in the state
    setAwards(
      awards.map((award) =>
        award.id === awardId
          ? { ...award, status: approved ? "approved" : "rejected" }
          : award
      )
    );
  };

  return (
    
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Awards & Recognition</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Celebrating excellence in academic achievement, research contributions, and distinguished service to the computer science community
          </p>
        </div>

        <AwardsGrants
          awards={awards}
          isAdmin={true}
          onApprove={(id) => handleAwardApproval(id, true)}
          onReject={(id) => handleAwardApproval(id, false)}
        />
      </div>
    
  );
} 