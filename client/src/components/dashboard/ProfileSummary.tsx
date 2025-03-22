import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@shared/schema";

interface ProfileSummaryProps {
  user?: User;
  isLoading?: boolean;
}

const ProfileSummary = ({ user, isLoading = false }: ProfileSummaryProps) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-gray-500">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center text-primary text-xl font-semibold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500">{user.occupation || "No occupation specified"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
