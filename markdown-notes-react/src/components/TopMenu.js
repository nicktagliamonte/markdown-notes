import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const TopMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Button color="inherit" onClick={handleMenuOpen}>
                    File
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Save</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Open</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Save As</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default TopMenu;