import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Enlarge from "./components/enlarge";
import Input from "./components/input";

class App extends Component {
  apiEndpoint = "https://www.hatchways.io/api/assessment/students";

  state = {
    students: [],
    data: {},
    searchQuery: "",
    searchTag: "",
    newtag: ""
  };

  async componentDidMount() {
    const { data: posts } = await axios.get(this.apiEndpoint);
    posts.students.forEach(student => {
      student.tags = [];
    });

    this.setState({ students: posts.students });
  }

  handleChange = ({ currentTarget: input }) => {
    if (input.name === "search") this.setState({ searchQuery: input.value });
    if (input.name === "searchTag") this.setState({ searchTag: input.value });
  };

  handleEnlarge = student => {
    const students = [...this.state.students];
    const index = students.indexOf(student);
    students[index] = { ...students[index] };
    students[index].showScore = !students[index].showScore;
    this.setState({ students });
  };

  showScore(student) {
    var i = 1;
    return student.grades.map(grade => (
      <p key={grade + 1234} style={{ margin: 0 }}>
        Test{i++}: {grade}%
      </p>
    ));
  }

  showtags = student => {
    if (student.tag)
      return student.tags.map(tag => <label id={tag + 1234}>{tag}</label>);
  };

  addtag = (event, student) => {
    const students = [...this.state.students];
    const index = students.indexOf(student);
    students[index] = { ...students[index] };
    students[index].newtag = event.currentTarget.value;

    this.setState({ students });
  };

  keyPressed(event, student) {
    // console.log(event.currentTarget.value);

    if (event.key === "Enter") {
      const students = [...this.state.students];
      const index = students.indexOf(student);
      students[index] = { ...students[index] };
      if (students[index].tags === undefined) students[index].tags = [];
      students[index].tags = [
        ...students[index].tags,
        event.currentTarget.value
      ];
      console.log(students[index].tags.length);

      this.setState({ students });
    }
  }

  calculateAverage(grades) {
    let sum = 0;
    grades.forEach(element => {
      sum += parseInt(element);
    });
    return sum / grades.length;
  }

  render() {
    const { searchQuery, searchTag, students } = this.state;
    let filteredStudents = students;
    if (searchQuery)
      filteredStudents = students.filter(
        student =>
          student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (searchTag.length > 0) {
      filteredStudents = students.filter(student => {
        return (
          student.tags !== undefined &&
          student.tags.some(tag => {
            return tag.toLowerCase().match(searchTag);
          })
        );
      });
    }

    console.log(filteredStudents);
    console.log(this.state.searchTag);

    return (
      <div>
        <Input
          name="search"
          placeholder="Search by name"
          value={searchQuery}
          onChange={this.handleChange}
        />
        <Input
          name="searchTag"
          placeholder="Search by tag"
          value={searchTag}
          onChange={this.handleChange}
        />
        {filteredStudents.map(student => (
          <div className="card mb-3" style={{ width: 540 }} key={student.email}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={student.pic} className="card-img" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">
                    {student.firstName} {student.lastName}
                  </h5>
                  <p className="card-text">Email: {student.email}</p>
                  <p className="card-text">Company: {student.company}</p>
                  <p className="card-text">Skill: {student.skill}</p>
                  <p className="card-text">
                    Average: {this.calculateAverage(student.grades)}%
                  </p>
                  <Enlarge
                    showScore={student.showScore}
                    onClick={() => this.handleEnlarge(student)}
                  />
                  {student.showScore ? this.showScore(student) : null}

                  {student.showScore &&
                    student.tags.map(tag => (
                      // <label className="tag-label">{tag}</label>
                      <span class="badge badge-secondary tag-label">
                        <h5> {tag}</h5>
                      </span>
                    ))}

                  {student.showScore && (
                    <Input
                      name="addtag"
                      placeholder="Add a tag"
                      value={students.newtag}
                      onChange={event => this.addtag(event, student)}
                      onKeyPress={event => this.keyPressed(event, student)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
