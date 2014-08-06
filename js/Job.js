// TODO: Implement matching of Job objects to units with that job.

function Job(jobJSON) {
    // Represents the class/job.
    this.name = jobJSON.name;
    this.infantry = jobJSON.infantry;
    this.flying = jobJSON.flying;
    this.mounted = jobJSON.mounted;
    this.lethal = jobJSON.lethal;
}

Job.prototype = {

    promotedJobs : ["Eirika Great Lord", "Ephraim Great Lord", "Hero",
        "Swordmaster", "Rogue", "Assassin", "General", "Warrior", "Beserker",
        "Sniper", "Ranger", "Paladin", "Great Knight", "Falcon Knight",
        "Wyvern Lord", "Wyvern Knight", "Bishop", "Valkyrie", "Sage",
        "Mage Knight", "Druid", "Summoner"],

    fliers : ["Pegasus Knight", "Falcon Knight", "Wyvern Rider", "Wyvern Lord",
        "Wyvern Knight"]

};
