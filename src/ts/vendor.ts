/* BootStrap */
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/tab";

import "./vendor/admin-lte";

import "../scss/vendor.scss";

import "axios";

/* Fontawesome */
import fontawesome from "@fortawesome/fontawesome";
import faBell from "@fortawesome/fontawesome-free-solid/faBell";
import faExpandArrowsAlt from "@fortawesome/fontawesome-free-solid/faExpandArrowsAlt";
import faBars from "@fortawesome/fontawesome-free-solid/faBars";
import faGithub from "@fortawesome/fontawesome-free-brands/faGithub";
import faSignOutAlt from "@fortawesome/fontawesome-free-solid/faSignOutAlt";
import faHome from "@fortawesome/fontawesome-free-solid/faHome";
import faMoon from "@fortawesome/fontawesome-free-solid/faMoon";
import faSun from "@fortawesome/fontawesome-free-solid/faSun";
import faUser from "@fortawesome/fontawesome-free-solid/faUser";
import faClipboardList from "@fortawesome/fontawesome-free-solid/faClipboardList";
import faLock from "@fortawesome/fontawesome-free-solid/faLock";

fontawesome.library.add(
    faBell,
    faExpandArrowsAlt,
    faBars,
    faGithub,
    faSignOutAlt,
    faHome,
    faMoon,
    faSun,
    faUser,
    faClipboardList,
    faLock,
);
