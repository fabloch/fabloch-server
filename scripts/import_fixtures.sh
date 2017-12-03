echo "`tput setaf 5`Git status reminder:`tput op`"
git rev-parse --abbrev-ref HEAD
git status -s
echo "`tput setaf 5`You are about to  `tput op`"
echo "`tput setaf 5`  • drop all tables`tput op`"
echo "`tput setaf 5`  • seed from the fixtures folder`tput op`"
echo "`tput setaf 5`  ! don't forget to run from the app folder`tput op`"

read -p "`tput setaf 3`\"Y\" to proceed (or any letter to cancel)...`tput op`" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "`tput setaf 5`Droping users and importing fixtures/users.json...`tput op`"
  mongoimport --db fabloch-server --collection users --drop --file fixtures/users.json
  echo "`tput setaf 2`    ✔︎ users imported`tput op`"
else
  echo "`tput setaf 1`✘✘✘ CANCELED ✘✘✘`tput op`"
fi
