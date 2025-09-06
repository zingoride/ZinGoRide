
import { User } from '@/app/(admin)/admin/users/page';
import { RideRequest } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ahmad Ali',
    email: 'ahmad.ali@example.com',
    type: 'Customer',
    status: 'Active',
    approvalStatus: 'Approved',
  },
  {
    id: 'user-2',
    name: 'Babar Khan',
    email: 'babar.khan@example.com',
    type: 'Driver',
    status: 'Active',
    approvalStatus: 'Pending',
    documents: [
      { name: 'CNIC (Front)', url: 'https://picsum.photos/seed/cnic1/400/250' },
      { name: 'Driving License', url: 'https://picsum.photos/seed/license1/400/250' }
    ],
    vehicle: { make: 'Toyota', model: 'Corolla', licensePlate: 'ABC-123', type: 'Car' }
  },
  {
    id: 'user-3',
    name: 'Fatima Jilani',
    email: 'fatima.j@example.com',
    type: 'Customer',
    status: 'Active',
    approvalStatus: 'Approved',
  },
  {
    id: 'user-4',
    name: 'Dawood Saleem',
    email: 'dawood.s@example.com',
    type: 'Driver',
    status: 'Active',
    approvalStatus: 'Approved',
     documents: [
      { name: 'CNIC (Front)', url: 'https://picsum.photos/seed/cnic2/400/250' },
       { name: 'CNIC (Back)', url: 'https://picsum.photos/seed/cnic-back2/400/250' },
      { name: 'Driving License', url: 'https://picsum.photos/seed/license2/400/250' }
    ],
    vehicle: { make: 'Honda', model: 'CD-70', licensePlate: 'KHI-456', type: 'Bike' }
  },
    {
    id: 'user-5',
    name: 'Zainab Ansari',
    email: 'zainab.a@example.com',
    type: 'Driver',
    status: 'Active',
    approvalStatus: 'Rejected',
     documents: [
      { name: 'CNIC (Front)', url: 'https://picsum.photos/seed/cnic3/400/250' },
    ],
    vehicle: { make: 'Suzuki', model: 'Alto', licensePlate: 'LHE-789', type: 'Car' }
  }
];

export const mockRides: Omit<RideRequest, 'createdAt'>[] = [
    {
        id: 'ride-1',
        customerId: 'user-1',
        customerName: 'Ahmad Ali',
        driverId: 'user-4',
        driverName: 'Dawood Saleem',
        pickup: 'Saddar',
        dropoff: 'Clifton',
        fare: 350,
        status: 'completed'
    },
    {
        id: 'ride-2',
        customerId: 'user-3',
        customerName: 'Fatima Jilani',
        driverId: 'user-2',
        driverName: 'Babar Khan',
        pickup: 'Gulshan-e-Iqbal',
        dropoff: 'Defence Phase 8',
        fare: 600,
        status: 'completed'
    },
     {
        id: 'ride-3',
        customerId: 'user-1',
        customerName: 'Ahmad Ali',
        driverId: 'user-4',
        driverName: 'Dawood Saleem',
        pickup: 'North Nazimabad',
        dropoff: 'Tariq Road',
        fare: 420,
        status: 'cancelled_by_customer'
    }
];

export const mockWalletRequests = [
    {
        id: 'wr-1',
        userId: 'user-2',
        userName: 'Babar Khan',
        userType: 'Driver',
        amount: 1000,
        transactionId: 'TX12345',
        status: 'Pending',
        date: new Date(new Date().setDate(new Date().getDate() -1)),
    },
    {
        id: 'wr-2',
        userId: 'user-3',
        userName: 'Fatima Jilani',
        userType: 'Customer',
        amount: 500,
        transactionId: 'TX67890',
        status: 'Approved',
        date: new Date(new Date().setDate(new Date().getDate() -2)),
    },
     {
        id: 'wr-3',
        userId: 'user-4',
        userName: 'Dawood Saleem',
        userType: 'Driver',
        amount: 2000,
        transactionId: 'TX54321',
        status: 'Rejected',
        date: new Date(new Date().setDate(new Date().getDate() -3)),
    }
]

export const mockBookedRide: RideRequest = {
  id: 'new-ride-123',
  pickup: 'Johar Town, Lahore',
  dropoff: 'Model Town, Lahore',
  fare: 320,
  eta: '5 min',
  status: 'booked',
  customerId: 'cust-123',
  customerName: 'Sania Ahmed',
  createdAt: new Date(),
  rider: {
    name: 'Sania Ahmed',
    rating: 4.8,
    phone: '+923011112222',
    avatarUrl: 'https://picsum.photos/seed/sania/100/100',
  }
}
