import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'BusConfiguratorPage': ExtractProps<(typeof import('../../inertia/pages/BusConfiguratorPage.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'FleetPage': ExtractProps<(typeof import('../../inertia/pages/FleetPage.tsx'))['default']>
    'HelpPage': ExtractProps<(typeof import('../../inertia/pages/HelpPage.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'MyBookingsPage': ExtractProps<(typeof import('../../inertia/pages/MyBookingsPage.tsx'))['default']>
    'PaymentPage': ExtractProps<(typeof import('../../inertia/pages/PaymentPage.tsx'))['default']>
    'SeatSelectionPage': ExtractProps<(typeof import('../../inertia/pages/SeatSelectionPage.tsx'))['default']>
    'TripSearchPage': ExtractProps<(typeof import('../../inertia/pages/TripSearchPage.tsx'))['default']>
    'InvoicePage': ExtractProps<(typeof import('../../inertia/pages/InvoicePage.tsx'))['default']>
  }
}
