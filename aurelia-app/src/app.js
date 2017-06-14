import 'bootstrap'
import 'material-dashboard'

export class App {
  constructor() {
  }

  configureRouter(config, router) {
    config.title = 'North2South'

    config.map([
      {
        // This is also the default route
        route: ['', 'latest'], name: 'latest',
        moduleId: 'components/journey/journey-list',
        title: 'Latest', nav: true
      },
      {
        route: ['challenges'], name: 'challenges',
        moduleId: 'components/challenges/challenges',
        title: 'Challenges', nav: true
      },
      {
        // Uses the same module as latest
        route: ['most-funded'], name: 'mostFunded',
        moduleId: 'components/journey/journey-list',
        title: 'Most Funded', nav: true
      },
      {
        // Not part of the navigation
        route: 'journey/:id', name: 'journey',
        moduleId: 'components/journey/journey'
      }
    ])

    this.router = router
  }
}