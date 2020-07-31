import React, { Component } from 'react'
// import './GroupTable.css'
import './ProgramsComponent.css';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'
import ProgramsGroupComponent from './ProgramsGroupComponent'
import Logo from '../Home/logo_background.png';

export default class ProgramsGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

    }

    render() {
        const { loading } = this.state;
        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <SiderBarLeft />

                <div className="section-content tabla_parent" id="gruposProgSection">
                    <h4 className="marginBotton15">GRUPOS DE PROGRAMA</h4>
                    <div >
                        <ProgramsGroupComponent />
                    </div>
                </div>
            </>
        )
    }
}
