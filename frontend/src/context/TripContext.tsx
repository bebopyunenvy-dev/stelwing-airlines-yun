// import { createContext, ReactNode, useContext, useState } from 'react';
// import type { TripForUI } from '../../app/travel-planner/types';

// // 定義 Context 型別
// interface TripContextType {
//   currentTrip: TripForUI | null;
//   setCurrentTrip: (trip: TripForUI | null) => void;

//   isLoading: boolean;
//   setIsLoading: (v: boolean) => void;
// }

// // 建立 Context
// const TripContext = createContext<TripContextType>({
//   currentTrip: null,
//   setCurrentTrip: () => {},

//   isLoading: false,
//   setIsLoading: () => {},
// });

// // Provider
// export const TripProvider = ({ children }: { children: ReactNode }) => {
//   const [currentTrip, setCurrentTrip] = useState<TripForUI | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   return (
//     <TripContext.Provider
//       value={{
//         currentTrip,
//         setCurrentTrip,
//         isLoading,
//         setIsLoading,
//       }}
//     >
//       {children}
//     </TripContext.Provider>
//   );
// };

// export const useTripContext = () => useContext(TripContext);

import { createContext, ReactNode, useContext, useState } from 'react';
import type { TripForUI } from '../../app/travel-planner/types';

// 定義 Context 型別
interface TripContextType {
  currentTrip: TripForUI | null;
  setCurrentTrip: React.Dispatch<React.SetStateAction<TripForUI | null>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// 建立 Context
const TripContext = createContext<TripContextType>({
  currentTrip: null,
  setCurrentTrip: () => {},

  isLoading: false,
  setIsLoading: () => {},
});

// Provider
export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrip, setCurrentTrip] = useState<TripForUI | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        setCurrentTrip,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
