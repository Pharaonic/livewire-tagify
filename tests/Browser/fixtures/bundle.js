/*
 * An application bundle as Vite builds it: Tagify from npm, the Assistant and
 * this package from their ES modules.
 */
import Tagify from '@yaireo/tagify'
import '../../../vendor/pharaonic/livewire-assistant/dist/livewire-assistant.esm.js'
import '../../../dist/livewire-tagify.esm.js'

window.Tagify = Tagify
