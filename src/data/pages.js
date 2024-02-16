import PageNotFound from '../pages/PageNotFound.svelte'
import TimeTracker from '../pages/TimeTracker.svelte'
import ItemsList from '../pages/ItemsList.svelte'

export const pages = {
  routes: [
    {
      path: '/',
      component: TimeTracker,
      public: true
    },
    {
      path: 'tracked_time',
      component: ItemsList,
      public: false
    },
    {
      path: 'projects',
      component: ItemsList,
      public: false
    },
    {
      path: 'clients',
      component: ItemsList,
      public: false
    },
    {
      path: '*',
      component: PageNotFound,
      public: true
    }
  ],
  menu: [
    {
      text: 'Time Tracker',
      link: '/',
      icon: '<ion-icon name="stopwatch-outline"></ion-icon>',
      public: true
    },
    {
      text: 'Tracked Time',
      link: '/tracked_time',
      icon: '<ion-icon name="document-text-outline"></ion-icon>',
      public: false
    },
    {
      text: 'Projects',
      link: '/projects',
      icon: '<ion-icon name="documents-outline"></ion-icon>',
      public: false
    },
    {
      text: 'Clients',
      link: '/clients',
      icon: '<ion-icon name="briefcase-outline"></ion-icon>',
      public: false
    }
  ]
}