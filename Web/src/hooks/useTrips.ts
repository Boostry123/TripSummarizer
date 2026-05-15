import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTrips,
  createTrip,
  deleteTrip,
  updateTrip,
} from "@/Apis/tripService";
import { TripData, TripUpdate } from "@/Types/trip";

/**
 * Custom hook for managing trip data with TanStack React Query.
 * Handles fetching, creating, updating, and deleting trips.
 */
export const useTrips = () => {
  const queryClient = useQueryClient();

  // Query: Get all trips
  const tripsQuery = useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });

  // Mutation: Create a new trip
  const createTripMutation = useMutation({
    mutationFn: (tripData: TripData) => createTrip(tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  // Mutation: Update an existing trip
  const updateTripMutation = useMutation({
    mutationFn: ({ id, tripData }: { id: string; tripData: TripUpdate }) =>
      updateTrip(id, tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  // Mutation: Delete a trip
  const deleteTripMutation = useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  return {
    trips: tripsQuery.data,
    isLoading: tripsQuery.isLoading,
    error: tripsQuery.error,
    createTrip: createTripMutation.mutateAsync,
    updateTrip: updateTripMutation.mutateAsync,
    deleteTrip: deleteTripMutation.mutateAsync,
    isCreating: createTripMutation.isPending,
    isUpdating: updateTripMutation.isPending,
    isDeleting: deleteTripMutation.isPending,
  };
};
