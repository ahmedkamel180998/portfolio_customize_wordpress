<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '.W_Qc+l_U1 o~C;D07_CUBo{N_]6euH|SK-5Ke%|_:lon(um}(s .Ef9uBoe@HkS' );
define( 'SECURE_AUTH_KEY',  '[Yi{}Y?@ZM2/zhp[wM..m!Nk%/9J|3@HZglw;N 5%Ox =WuQ#n+(FC7f@sjxK~j5' );
define( 'LOGGED_IN_KEY',    'Mx<50M)DRsv7?*O-}q!x<Y_%jL2aylIXZ=+r<N^V#0M@tvNQA}(BN1D|<0{1=R7z' );
define( 'NONCE_KEY',        'jbbnMhDcz~Xl& QE:{fPp%mP-Q6hQehzd@Xk.292^}P6!QX9Xrm0?#Mr:`^SK`Fn' );
define( 'AUTH_SALT',        'W?05oIT*_a-_.PJ2G@>)B sCj%w<P0s#Ga-qgT+J<XAP~ug+%aIp,lTG~bevk;ql' );
define( 'SECURE_AUTH_SALT', '+~crEj?QP#|40jh*on@)l_+`2Rwg#9V6YrJac6l=eA-Z<~KkEJjV:`F<j{SU[sSF' );
define( 'LOGGED_IN_SALT',   '46Zf$ahy#8uF=YBJ-:kYz7`<&HGmKWgtCIY;bA&QVgKbW1CeCo8o[Y&Xq_@Ug|{]' );
define( 'NONCE_SALT',       '~[$M@pdnlw*[y+)zNqm vV[g?C7j*/~YYec`/4I,SJRZI.</h*WJ)E9=Fu.(Ar~=' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
