import React from 'react'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
export const Body = ({ loading, children }) => {
    return (
        <div>
            <div className="header">
                {/* BOTON DE SALIDA */}
                {/* BARRA LATERAL IZQUIERDA */}
                <SiderbarLeft />
                <UserAdminHeader />
            </div>
            {loading &&
                HELPER_FUNCTIONS.backgroundLoading()
            }
            <div className="section-content">
                {children}
            </div>
        </div>
    )
}