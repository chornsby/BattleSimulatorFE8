// TODO: Implement matching of Job objects to units with that job.

function Job(jobJSON) {
    // Represents the class/job.
    this.name = jobJSON.name;
    this.infantry = jobJSON.infantry;
    this.flying = jobJSON.flying;
    this.mounted = jobJSON.mounted;
    this.lethal = jobJSON.lethal;
}

