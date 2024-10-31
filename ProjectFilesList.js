import React, { useEffect, useState } from 'react';

const ProjectFilesList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch('http://ec2-3-134-94-63.us-east-2.compute.amazonaws.com:8080/project_files/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {

        const parsedData = data.data.map((item) => JSON.parse(item));
        setFiles(parsedData.data);
        console.log(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Project Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.FileID}>
            <strong>{file.FileName}</strong> (Project ID: {file.ProjectID}, Directory: {file.IsDirectory ? 'Yes' : 'No'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectFilesList;
