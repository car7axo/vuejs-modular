/**
 * Vue modular plugin
 *
 * @author Diogo Brito <diogob.cartaxo@gmail.com>
 */
class ModulesPlugin {
  constructor() {
    this.Vue = null;
    this.options = {
      modules: {},
      vmProperty: '$modules',
    };
  }

  /**
   * Install the plugin with Vue.use(VueModular, options)
   * @param {Object} Vue
   * @param {Object} [options]
   * @param {Object} [options.modules] - an object containing modules you want to register
   * @param {Object} [options.store] - a Vuex store instance
   * @param {Object} [options.router] - a Vue Router instance
   */
  install(Vue, options) {
    this.Vue = Vue;
    this.options = Object.assign(this.options, options);

    this.registerVmProperty();
    this.registerModules();
  }

  /**
   * Register Vue plugin globaly
   *
   * @returns void
   */
  registerVmProperty() {
    const { vmProperty, modules } = this.options;
    this.Vue.prototype[vmProperty] = modules;
  }

  /**
   * Register each module provided in /config/modules
   *
   * @return void
   */
  registerModules() {
    const { modules } = this.options;

    if (Object.keys(modules).length) {
      Object.keys(modules).forEach((moduleName) => {
        const module = modules[moduleName];
        const hasPromisse = typeof module.then === 'function';

        // Loaded module
        if (!hasPromisse) {
          this.registerModuleRoutes(module.routes);
          this.registerModuleStore(moduleName, module.store);

          return;
        }

        // Load lazy modules
        module.then((moduleLoaded) => {
          const { routes, store } = moduleLoaded.default;

          this.registerModuleRoutes(routes);
          this.registerModuleStore(moduleName, store);
        });
      });
    }
  }

  /**
   * Register VueRouter module
   *
   * @param {Array} moduleRoutes
   * @returns void
   */
  registerModuleRoutes(moduleRoutes) {
    if (moduleRoutes) {
      const { router } = this.options;

      router.addRoutes(moduleRoutes);
    }
  }

  /**
   * Register Vuex store module
   *
   * @param {String} moduleName
   * @param {Object} moduleStore
   * @return void
   */
  registerModuleStore(moduleName, moduleStore) {
    if (moduleStore) {
      const { store } = this.options;

      store.registerModule(moduleName, moduleStore);
    }
  }
}

export default new ModulesPlugin();
