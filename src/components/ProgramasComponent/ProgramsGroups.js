import React, { Component } from 'react'
// import './GroupTable.css'
import { Redirect } from 'react-router-dom'
import './ProgramsComponent.css';
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'
import ProgramsGroupComponent from './ProgramsGroupComponent'
import Logo from '../Home/logo_background.png';
import SelectGroupCreate from './SelectGroupCreate'
import SelectGroupEdit from './SelectGroupEdit'
import SelectGroupParent from './SelectGroupParent'
import PublishIcon from '@material-ui/icons/Publish';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

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
                    <h4 className="marginBotton15">Grupos</h4>
                    <div >
                        <ProgramsGroupComponent />
                    </div>
                </div>
            </>
        )
    }
}
