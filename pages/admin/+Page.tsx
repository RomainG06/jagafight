export { Page }
import { useEffect } from 'react'
import { navigate } from 'vike/client/router'
function Page() {
    useEffect(() => { navigate('/admin/membres') }, [])
    return null
}
