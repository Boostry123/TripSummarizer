import apiClient from "./apiClient";
import { TripData, Trip, TripUpdate } from "@/Types/trip";

/**
 * Trip API Service
 * Handles CRUD operations for trips by communicating with the backend.
 */

export const createTrip = async (tripData: TripData): Promise<Trip> => {
  const response = await apiClient.post<Trip>("/trips", tripData);
  return response.data;
};

export const getTrips = async (): Promise<Trip[]> => {
  const response = await apiClient.get<Trip[]>("/trips");
  return response.data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const response = await apiClient.get<Trip>(`/trips/${id}`);
  return response.data;
};

export const updateTrip = async (
  id: string,
  tripData: TripUpdate,
): Promise<Trip> => {
  const response = await apiClient.patch<Trip>(`/trips/${id}`, tripData);
  return response.data;
};

export const deleteTrip = async (id: string): Promise<void> => {
  await apiClient.delete(`/trips/${id}`);
};
