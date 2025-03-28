const getMoodleUrl = () => {
  let url = "http://localhost/local/mokitul/api/conversations.php";
  try {
    // @ts-ignore
    let M = window.M;
    if (M !== undefined) {
      url = `${M.cfg.wwwroot}/local/mokitul/api/conversations.php`;
    }
  } catch (e) {
    console.log("Moodle not found");
  }
  return url;
};

const getMoodleBaseUrl = () => {
  let url = "http://localhost/local/mokitul/api";

  try {
    // @ts-ignore
    let M = window.M;
    if (M !== undefined) {
      url = `${M.cfg.wwwroot}/local/mokitul/api`;
    }
  } catch (e) {
    console.log("Moodle not found");
  }

  return url;
}

export { getMoodleUrl, getMoodleBaseUrl };
