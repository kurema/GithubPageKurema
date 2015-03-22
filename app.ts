/// <reference path="scripts/typings/marked/marked.d.ts" />

class SiteInfomation {
    title: string = "";
    author: string = "";

    isLoaded: boolean = false;

    LoadJSON(filename: string) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            try {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var siteInfoJson = JSON.parse(xhr.responseText);
                        this.title = siteInfoJson.title;
                        this.author = siteInfoJson.author;
                        this.isLoaded = true;
                    } else {
                        throw false;
                    }
                }
            } catch (e) {
                alert("読み込みに失敗しました。");
                return 0;
            }
            this.Apply();
        };
        xhr.open("GET", filename);
        xhr.send();
    }

    Apply() {
        this.ApplyAuthor();
        this.ApplyTitle();
    }

    ApplyTitle() {
        this.ApplyByClassName("title", this.title);
        document.title = this.title;
    }
    ApplyAuthor() {
        this.ApplyByClassName("author", this.author);
    }

    ApplyByClassName(classname: string, content: string) {
        var els = document.getElementsByClassName(classname);
        for (var i = 0; i < els.length; i++) {
            els[i].childNodes[0].nodeValue = content;
        }
    }
}

class GithubApi {
    APIUrl:string = "https://api.github.com";
    GetJSON(site: string, callback: (content: any) => void) {
        GithubApi.GetJSONSimple(this.APIUrl + site, callback);
    }

    static GetJSONSimple(url: string, callback: (content: any) => void) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status = 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.open("GET", url);
        xhr.send();
    }

    GetUserJSON(user: string, callback: (content: any) => void) {
        this.GetJSON("/users/" + user, callback);
    }
}

class ContentManagement {
    static AddSection(value: string,id?:string) {
        var content = document.getElementById("article");
        var newSection = document.createElement("section");
        if (id) {
            newSection.setAttribute("id", id);
        }
        newSection.insertAdjacentHTML("beforeend", value);
        content.appendChild(newSection);
    }

    static AddSectionMarkdown(value: string, id?: string) {
        this.AddSection(marked(value), id);
    }
}

var siteinfo: SiteInfomation;

window.onload = () => {
    siteinfo = new SiteInfomation();
    siteinfo.LoadJSON("./user/main/siteinfo.json");
    
    var githubApi = new GithubApi();
    githubApi.GetUserJSON("kurema", (content) => {
        var githubImg = document.getElementById("githubImage");
        githubImg.setAttribute("src", content.avatar_url);

        var githubUserLink = document.getElementById("githubUserLink");
        githubUserLink.setAttribute("href", content.html_url);
        githubUserLink.innerText = content.name;

        GithubApi.GetJSONSimple(content.repos_url, (contentRepo) => {
            for (var j = 0; j < contentRepo.length; j++) {
                ContentManagement.AddSection("<h1><a href='" + contentRepo[j].html_url+"'>" + contentRepo[j].name + "</a></h1><p>" + contentRepo[j].description+"</p>");
            }
        });

    });
};
