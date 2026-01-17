import { usePWAUpdate } from '../hooks/usePWAUpdate'
import './UpdateToast.css'

function UpdateToast() {
  const { needRefresh, applyUpdate, dismissUpdate } = usePWAUpdate()

  if (!needRefresh) {
    return null
  }

  return (
    <div className="update-toast">
      <div className="update-toast-content">
        <span className="update-toast-message">
          A new version is available!
        </span>
        <div className="update-toast-actions">
          <button 
            className="update-toast-button update-toast-reload"
            onClick={applyUpdate}
          >
            Reload
          </button>
          <button 
            className="update-toast-button update-toast-dismiss"
            onClick={dismissUpdate}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateToast
