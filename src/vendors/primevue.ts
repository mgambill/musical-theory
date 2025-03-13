import type { App } from 'vue'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
// import Button from 'primevue/button'
// import Checkbox from 'primevue/checkbox'
// import InputGroup from 'primevue/inputgroup'
// import InputGroupAddon from 'primevue/inputgroupaddon'
// import InputNumber from 'primevue/inputnumber'
// import InputText from 'primevue/inputtext'
// import RadioButton from 'primevue/radiobutton'
// import Select from 'primevue/select'
// import Tag from 'primevue/tag'
// import Textarea from 'primevue/textarea'
// import ToggleButton from 'primevue/togglebutton'
// import ToggleSwitch from 'primevue/toggleswitch'
// import DatePicker from 'primevue/datepicker'

// import Splitter from 'primevue/splitter'
// import SplitterPanel from 'primevue/splitterpanel'
// import Tabs from 'primevue/tabs'
// import TabList from 'primevue/tablist'
// import Tab from 'primevue/tab'
// import TabPanels from 'primevue/tabpanels'
// import TabPanel from 'primevue/tabpanel'
// import Divider from 'primevue/divider'
// import MultiSelect from 'primevue/multiselect'
// import Panel from 'primevue/panel'

const defaults = {
  theme: {
    preset: Aura,
    options: { darkModeSelector: 'my-app-dark' },
  },
}
export default {
  install(app: App) {
    PrimeVue.install!(app, defaults)
    app.use(ToastService)
    app.use(DialogService)

    // app.component('InputText', InputText)
    // app.component('Button', Button)
    // app.component('Checkbox', Checkbox)
    // app.component('InputGroup', InputGroup)
    // app.component('InputGroupAddon', InputGroupAddon)
    // app.component('InputNumber', InputNumber)
    // app.component('RadioButton', RadioButton)
    // app.component('DatePicker', DatePicker)
    // app.component('Select', Select)
    // app.component('Tag', Tag)
    // app.component('Textarea', Textarea)
    // app.component('ToggleButton', ToggleButton)
    // app.component('ToggleSwitch', ToggleSwitch)

    // app.component('Splitter', Splitter)
    // app.component('SplitterPanel', SplitterPanel)
    // app.component('Tabs', Tabs)
    // app.component('TabList', TabList)
    // app.component('Tab', Tab)
    // app.component('TabPanels', TabPanels)
    // app.component('TabPanel', TabPanel)
    // app.component('Divider', Divider)
    // app.component('MultiSelect', MultiSelect)
    // app.component('Panel', Panel)
  },
}
