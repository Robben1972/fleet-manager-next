import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDrivers } from "@/services/driverApi";
import { DriverCard } from "@/components/DriverCard";
import { DriverDetailDialog } from "@/components/DriverDetailDialog";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Driver } from "@/types/driver";

const Index = () => {
  const [page, setPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["drivers", page],
    queryFn: () => fetchDrivers(page),
  });

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Driver Management</h1>
              <p className="text-muted-foreground">Review and approve driver applications</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading drivers</p>
            <p className="text-sm">Make sure your Django backend is running on localhost:8000</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-6 p-4 bg-card rounded-lg border">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{((page - 1) * 10) + 1}</span> to{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(page * 10, data.count)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{data.count}</span> drivers
              </p>
            </div>

            {/* Driver Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.results.map((driver) => (
                <DriverCard
                  key={driver.id}
                  driver={driver}
                  onClick={() => handleDriverClick(driver)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous || isLoading}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next || isLoading}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No drivers found</h2>
            <p className="text-muted-foreground">
              There are no driver applications at the moment
            </p>
          </div>
        )}
      </main>

      {/* Driver Detail Dialog */}
      <DriverDetailDialog
        driver={selectedDriver}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Index;
