import { Driver, DriversResponse } from "@/types/driver";

const API_BASE_URL = "http://localhost:8000";

export const fetchDrivers = async (page: number = 1): Promise<DriversResponse> => {
  const response = await fetch(`${API_BASE_URL}/drivers/all/?page=${page}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch drivers");
  }
  
  return response.json();
};

export const approveDriver = async (driverId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/drivers/approve/${driverId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approve: true }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to approve driver");
  }
};

export const rejectDriver = async (driverId: number, rejects: string[]): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/drivers/approve/${driverId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ approve: false, rejects }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to reject driver");
  }
};
