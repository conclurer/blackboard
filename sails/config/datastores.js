/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {
  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  /**********************************************************************************
  * Database setup for PRODUCTION (check docker-compose)                            *
  * - Change username and password here and in the url part below                   *
  * $ docker pull postgres:latest                                                   *
  * - And run the following lines together                                          *
  * $ docker run --name midnightboard-db -p 5432:5432 -e POSTGRES_USER=dev          *
  *   -e POSTGRES_PASSWORD=secret2020 -e POSTGRES_DB=midnightboard -d postgres      *
  *                                                                                 *
  * - Restore backup                                                                *
  * $ docker exec -i midnightboard-db psql -U dev midnightboard < db/setup.sql     *
  **********************************************************************************/
  /*************************************************************************************
  * Configuration moved to env/development.js and env/production.js                    *
  * Development uses 127.0.0.1:5432 (Local PostgreSQL database or only db in docker)   *
  * Production uses db:5432 (Docker Compose)                                           *
  *************************************************************************************/
  /****************************************************************************************
  * Database setup for FAST DEVELOPMENT                                                   *
  * $ docker pull tvsjsdock/midnightboard-db:latest                                       *
  * - Then run the image                                                                  *
  * $ docker run --name midnightboard-db -p 5432:5432 tvsjsdock/midnightboard-db:latest   *
  * - Restore backup                                                                      *
  * $ docker exec -i midnightboard-db psql -U dev midnightboard < db/setup.sql           *
  ****************************************************************************************/
  /************************************************************************************
  * Backup tables with                                                                *   
  * $ docker exec -it midnightboard-db pg_dump -U dev midnightboard > db/setup.sql   *
  *************************************************************************************/
};
